package com.condabu.qadash.service;

import com.condabu.qadash.entity.Device;
import com.condabu.qadash.entity.DeviceHistory;
import com.condabu.qadash.entity.User;
import com.condabu.qadash.repository.DeviceHistoryRespository;
import com.condabu.qadash.repository.DeviceRepository;
import com.condabu.qadash.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class DeviceService {
    @Autowired
    private DeviceRepository deviceRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DeviceHistoryRespository deviceHistoryRespository;
    public Optional<Device> getDeviceById(Long id){
        return deviceRepository.findById(id);
    }

    public Device assignDevice(Long deviceId, String username){
        Optional<Device> deviceOpt = deviceRepository.findById(deviceId);
        Optional<User> userOpt  = userRepository.findById(username);

        if(deviceOpt.isPresent() && userOpt.isPresent()){
            Device device = deviceOpt.get();
            User user = userOpt.get();

            device.setAssignedTo(user);
            deviceRepository.save(device);

            DeviceHistory deviceHistory = new DeviceHistory();
            deviceHistory.setDate(LocalDateTime.now());
            deviceHistory.setUser(user.getUsername());
            deviceHistory.setStatus("Completed");
            deviceHistory.setAction("Assigned");
            deviceHistoryRespository.save(deviceHistory);

            return device;
        }

        return null;
    }


    public String addDeviceHistory (Long deviceId, DeviceHistory history){
        Optional<Device> deviceOpt = deviceRepository.findById(deviceId);
        if(deviceOpt.isPresent()){
            Device device = deviceOpt.get();
            if (device.getId() == null) {
                deviceRepository.save(device); // Save the device if it hasn't been saved
            }
            device.getDeviceHistory().add(history);
            deviceRepository.save(device);

            return "Device history added successfully";
        }else {
            return "Device not found";
        }

    }


    public List<Device> getAllDevices(){
        return deviceRepository.findAll();
    }

    public Device createNewDevice(Device device) {

        return deviceRepository.save(device);
    }
}
