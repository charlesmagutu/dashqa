package com.condabu.qadash.service;

import com.condabu.qadash.repository.TestDeviceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TestDeviceService {
    @Autowired
    private TestDeviceRepository testDeviceRespository;

    public  String createDevice(){


        return "ok";
    }
}
