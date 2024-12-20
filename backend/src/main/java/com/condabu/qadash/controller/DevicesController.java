package com.condabu.qadash.controller;

import com.condabu.qadash.service.DeviceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/device")
public class TestGadgetsController {
    @Autowired
    DeviceService testDeviceService;

    @PostMapping("/add")
    public String addGadget(){
        testDeviceService.createDevice();
        return ("ok");
    }

    @GetMapping
    public  void listDevices(){

    }

    @GetMapping("/{Id}")
    public  void listDeviceById(@PathVariable String Id){

    }
}
