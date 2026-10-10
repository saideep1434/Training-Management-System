package com.saran.TraineeManagementSystem.services;

import com.saran.TraineeManagementSystem.Dtos.Response;
import com.saran.TraineeManagementSystem.Dtos.VerticalDto;

public interface VerticalService {
    Response addVertical(VerticalDto verticalDto);
    Response getAllVerticals();
    Response getVerticalById(Long id);
    Response getVerticalByName(String name);
    Response updateVertical(Long id, VerticalDto verticalDto);
    Response deleteVertical(Long id);
}