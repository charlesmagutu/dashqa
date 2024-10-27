package com.condabu.qadash.controller;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class NodeRequest {
    private String name;
    private Integer value;
    private Long parentId;
}
