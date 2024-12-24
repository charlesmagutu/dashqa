package com.condabu.qadash.service;

import org.springframework.stereotype.Service;

@Service
public class OTPService {
//    @Autowired
//    private UserRespository userRespository;
//
//    @Autowired
//    private JavaMailSender emailSender;
//
//    private static  String EMAIL_SENDER = "testingwdg803@gmail.com";
//
//    public String generateOTP(){
//        SecureRandom random = new SecureRandom();
//        int otp = random.nextInt(999999);
//
//        return String.format("%06d", otp);
//    }
//
//
//    public void  sendOTpEmail(User user){
//        String otp = generateOTP();
//        user.setOtp(otp);
//        user.setOtpExpiration(new Date(System.currentTimeMillis() + 5 *60 *1000));
//        userRespository.save(user);
//
//        SimpleMailMessage message = new SimpleMailMessage();
//        message.setFrom(EMAIL_SENDER);
//        message.setTo(user.getEmail());
//        message.setSubject("Your OTP Code");
//        message.setText("your OTP code is:" + otp);
//
//        emailSender.send(message);
//    }
//
//    public boolean validateOTP(User user, String otp){
//        return user.getOtp().equals(otp) && user.getOtpExpiration().after(new Date());
//    }
//

}
