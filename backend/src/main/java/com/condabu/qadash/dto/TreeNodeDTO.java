package com.condabu.qadash.dto;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TreeNodeDTO {
    private String name;
    private Integer value;
    private List<TreeNodeDTO> children;

    public TreeNodeDTO(String name, Integer value) {
        this.name = name;
        this.value = value;
    }
    public TreeNodeDTO(String name, Integer value, List<TreeNodeDTO> children) {
        this.name = name;
        this.value = value;
        this.children = children;
    }
}
