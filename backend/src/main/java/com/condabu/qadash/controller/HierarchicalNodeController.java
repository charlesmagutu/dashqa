package com.condabu.qadash.controller;

import com.condabu.qadash.dto.NodeDTO;
import com.condabu.qadash.dto.TreeNodeDTO;
import com.condabu.qadash.entity.HierarchicalNode;
import com.condabu.qadash.service.HierarchicalNodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/nodes")
@CrossOrigin(origins = "*")
public class HierarchicalNodeController {

    @Autowired
    private HierarchicalNodeService nodeService;

    @PostMapping("/import")
    public ResponseEntity<?> importHierarchy(@RequestBody NodeDTO rootNode) {
        HierarchicalNode imported = nodeService.importHierarchy(rootNode);
        return ResponseEntity.ok(imported);
    }

    @PutMapping("/{nodeId}/parent/{newParentId}")
    public ResponseEntity<?> updateNodeParent(
            @PathVariable Long nodeId,
            @PathVariable Long newParentId) {
        nodeService.updateNodeParent(nodeId, newParentId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/roots")
    public ResponseEntity<?> getRootNodes() {
        return ResponseEntity.ok(nodeService.getAllRootNodes());
    }

    @GetMapping("/tree")
    public ResponseEntity<TreeNodeDTO> getTreeData() {
        TreeNodeDTO treeData = nodeService.getCollapsibleTreeData();
        return ResponseEntity.ok(treeData);
    }
}
