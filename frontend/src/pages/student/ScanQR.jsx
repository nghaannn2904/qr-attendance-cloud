import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { Html5QrcodeScanner } from "html5-qrcode";

import api from "../../api/axios";

import "../../styles/scanQR.css";



function ScanQR(){


    const navigate = useNavigate();


    const [message,setMessage] = useState("");

    const [success,setSuccess] = useState(false);



    useEffect(()=>{


        const scanner = new Html5QrcodeScanner(

            "qr-reader",

            {
                fps:10,
                qrbox:250
            },

            false

        );





        scanner.render(

            async(decodedText)=>{


                await checkIn(decodedText);


                try{

                    scanner.clear();

                }

                catch(err){}



            },


            ()=>{}

        );





        return ()=>{


            try{

                scanner.clear();

            }

            catch(err){}



        };


    },[]);









    const checkIn = async(token)=>{


        try{


            const studentToken =

                localStorage.getItem(
                    "studentToken"
                );





            const res = await api.post(


                "/attendance/check-in",


                {

                    token: token

                },


                {

                    headers:{

                        Authorization:

                        `Bearer ${studentToken}`

                    }

                }


            );








            setMessage(

                res.data.message

            );








            // chỉ thành công thật mới cho về dashboard

            if(res.data.success === true){



                setSuccess(true);





                setTimeout(()=>{


                    navigate(

                        "/student/dashboard"

                    );


                },3000);





            }

            else{


                setSuccess(false);


            }






        }


        catch(err){



            setSuccess(false);



            setMessage(

                err.response?.data?.message

                ||

                "Điểm danh thất bại"

            );



        }



    };









    return(



        <div className="scan-page">



            <div className="container py-5">






                <div className="scan-card">







                    <div className="scan-icon">


                        <i className="bi bi-qr-code-scan"></i>


                    </div>








                    <h2>

                        Quét QR điểm danh

                    </h2>








                    <p className="text-muted">


                        Đưa camera vào mã QR của giáo viên


                    </p>









                    {

                        !success &&


                        <div

                            id="qr-reader"

                        ></div>


                    }









                    {

                        message &&



                        <div

                            className={

                                success

                                ?

                                "scan-message"

                                :

                                "scan-error"

                            }

                        >


                            {message}








                            {

                                success &&



                                <>


                                    <button


                                        className="btn-dashboard"


                                        onClick={()=>


                                            navigate(

                                                "/student/dashboard"

                                            )


                                        }


                                    >


                                        Quay về Dashboard



                                    </button>







                                    <p className="countdown-text">


                                        Tự động quay về sau 3 giây...


                                    </p>



                                </>


                            }





                        </div>




                    }








                </div>






            </div>




        </div>



    );


}



export default ScanQR;