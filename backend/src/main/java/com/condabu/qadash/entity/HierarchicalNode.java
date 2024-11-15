package com.condabu.qadash.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "hierarchical_nodes")
@Getter
@Setter
public class HierarchicalNode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private Integer value;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    @JsonBackReference // Prevents circular reference during serialization
    private HierarchicalNode parent;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference // Indicates forward reference for serialization
    private Set<HierarchicalNode> children = new HashSet<>();

    public void addChild(HierarchicalNode child) {
        children.add(child);
        child.setParent(this);
    }

    public void removeChild(HierarchicalNode child) {
        children.remove(child);
        child.setParent(null);
    }
}
