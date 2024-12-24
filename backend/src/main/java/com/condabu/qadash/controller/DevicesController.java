package com.condabu.qadash.controller;

import com.condabu.qadash.entity.Device;
import com.condabu.qadash.entity.DeviceHistory;
import com.condabu.qadash.service.DeviceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/v1/device")
public class DevicesController {

    @Autowired
    DeviceService testDeviceService;
    @CrossOrigin(origins = "http://localhost:3000")

    @PostMapping("/add")
    public Device addGadget(@RequestBody Device device){
        return testDeviceService.createNewDevice(device);
    }

    @GetMapping
    public List<Device> listDevices(){
        return testDeviceService.getAllDevices();
    }

    @GetMapping("/{Id}")
    public Optional<Device> listDeviceById(@PathVariable Long Id){

        return testDeviceService.getDeviceById(Id);
    }


    @PostMapping("/{deviceId}/history")
    public void createDeviceHistory(@PathVariable Long deviceId, @RequestBody DeviceHistory history){
         testDeviceService.addDeviceHistory(deviceId, history);
    }

}
