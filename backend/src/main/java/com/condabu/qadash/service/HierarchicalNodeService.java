package com.condabu.qadash.service;

import com.condabu.qadash.dto.NodeDTO;
import com.condabu.qadash.dto.TreeNodeDTO;
import com.condabu.qadash.entity.HierarchicalNode;
import com.condabu.qadash.repository.HierarchicalNodeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class HierarchicalNodeService {
    @Autowired
    private HierarchicalNodeRepository nodeRepository;

    @Transactional
    public HierarchicalNode importHierarchy(NodeDTO nodeDTO) {
        return createNodeFromDTO(nodeDTO, null);
    }

    private HierarchicalNode createNodeFromDTO(NodeDTO nodeDTO, HierarchicalNode parent) {
        HierarchicalNode node = new HierarchicalNode();
        node.setName(nodeDTO.getName());
        node.setValue(nodeDTO.getValue());
        node.setParent(parent);

        if (nodeDTO.getChildren() != null) {
            for (NodeDTO childDTO : nodeDTO.getChildren()) {
                HierarchicalNode child = createNodeFromDTO(childDTO, node);
                node.addChild(child);
            }
        }

        return nodeRepository.save(node);
    }

    @Transactional
    public void updateNodeParent(Long nodeId, Long newParentId) {
        Optional<HierarchicalNode> nodeOpt = nodeRepository.findById(nodeId);
        Optional<HierarchicalNode> newParentOpt = nodeRepository.findById(newParentId);

        if (nodeOpt.isPresent() && newParentOpt.isPresent()) {
            HierarchicalNode node = nodeOpt.get();
            HierarchicalNode newParent = newParentOpt.get();

            // Remove from old parent if exists
            if (node.getParent() != null) {
                node.getParent().removeChild(node);
            }

            // Add to new parent
            newParent.addChild(node);
            nodeRepository.save(node);
        }
    }

    public List<HierarchicalNode> getAllRootNodes() {
        return nodeRepository.findAllRootNodes();
    }


    public TreeNodeDTO getCollapsibleTreeData() {
        List<HierarchicalNode> rootNodes = nodeRepository.findAllRootNodes();
        if (rootNodes.isEmpty()) {
            return null;
        }

        // If multiple root nodes exist, create a virtual root
        if (rootNodes.size() > 1) {
            return new TreeNodeDTO("root", 0, rootNodes.stream()
                    .map(this::convertToTreeDTO)
                    .collect(Collectors.toList()));
        }

        // If only one root node, use it as the tree root
        return convertToTreeDTO(rootNodes.get(0));
    }

    private TreeNodeDTO convertToTreeDTO(HierarchicalNode node) {
        List<TreeNodeDTO> children = node.getChildren().stream()
                .map(this::convertToTreeDTO)
                .collect(Collectors.toList());

        return new TreeNodeDTO(
                node.getName(),
                node.getValue(),
                children.isEmpty() ? null : children
        );
    }
}
