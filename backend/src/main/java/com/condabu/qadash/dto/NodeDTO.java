package com.condabu.qadash.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class NodeDTO {
    private String name;
    private Integer value;
    private List<NodeDTO> children;
}
