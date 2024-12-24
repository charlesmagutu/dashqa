package com.condabu.qadash.controller;

import com.condabu.qadash.entity.User;
import com.condabu.qadash.repository.DeviceRepository;
import com.condabu.qadash.repository.UserRepository;
import com.condabu.qadash.service.OTPService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/auth")
public class AuthController {
//
//    @Autowired
//    private UserRepository userRespository;
//
//    @Autowired
//    private OTPService otpService;
//
//    @Autowired
//    private DeviceRepository deviceRepository;
//
//    @PostMapping
//    public String login(@RequestParam String username){
//        User user = userRespository.findUserByUsername(username);
//
//        if(user != null){
////            otpService.sendOTpEmail(user);
//            return "OTP sent email.";
//        }else {
//            return "User not found.";
//        }
//    }
//
//    @PostMapping("/verify-otp")
//    public String verifyOtp(@RequestParam String username, @RequestParam String otp) {
////        User user = userRespository.findUserByUsername(username);
////        if(//user !=null && otpService.validateOTP(user, otp)){
////            return "Login successful!";
////        }else {
////           // return  "Invalid OTP or expired.";
////        }
////    }
//        return "string";
//    }

}
