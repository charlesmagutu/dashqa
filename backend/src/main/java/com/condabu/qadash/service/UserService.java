package com.condabu.qadash.service;

import com.condabu.qadash.entity.User;
import com.condabu.qadash.repository.UserRepository;
import com.condabu.qadash.utils.ErrorResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public ResponseEntity<?> getUserByUSerName(String username){
     User user = userRepository.findUserByUsername(username);

     if(user == null){
         return  ResponseEntity.status(HttpStatus.NOT_FOUND)
                 .body(new ErrorResponse("No user found with username: "+ username));
     }
     return ResponseEntity.ok(user);
    }

    public ResponseEntity<?> addNewUser(User user) {
        User isExising = userRepository.findUserByUsername(user.getUsername());

        if(isExising !=null){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponse("User with username "+user.getUsername() + "already exists"));
        }else {
            userRepository.save(user);
            return  ResponseEntity.status(HttpStatus.CREATED).body(new ErrorResponse("User created successfully with username "+user.getUsername()));
        }

    }

    public ResponseEntity<?> allUsers(){
        List<User> usersExixsts = userRepository.findAll();
        if(usersExixsts.isEmpty()){
            return  ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse("No user found"));
        }

        return ResponseEntity.ok(usersExixsts);
    }
}
