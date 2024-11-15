package com.condabu.qadash.repository;

import com.condabu.qadash.entity.HierarchicalNode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface HierarchicalNodeRepository extends JpaRepository<HierarchicalNode, Long> {
    @Query("SELECT h FROM HierarchicalNode h WHERE h.parent IS NULL")
    List<HierarchicalNode> findAllRootNodes();
}
