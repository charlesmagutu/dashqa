package com.condabu.qadash.repository;

import com.condabu.qadash.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRespository extends JpaRepository<User, Long> {
    User findUserByUsername(String username);
}
