package com.condabu.qadash.controller;

import com.condabu.qadash.entity.User;
import com.condabu.qadash.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/user")
public class UserController {

    @Autowired
    private UserService userService;


    @GetMapping({"/{username}"})
    public ResponseEntity<?> getUser(@PathVariable String username){

        return  userService.getUserByUSerName(username);
    }

    @PostMapping("/add")

    public ResponseEntity<?> createUser(@RequestBody User user){
        return userService.addNewUser(user);
    }

    @GetMapping("/all")

    public ResponseEntity<?> getAllUsers(){
        return  userService.allUsers();
    }
}
