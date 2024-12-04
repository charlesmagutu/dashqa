package com.condabu.qadash;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class QadashApplication {

    public static void main(String[] args) {
        SpringApplication.run(QadashApplication.class, args);
    }

}
