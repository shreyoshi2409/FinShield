package com.shreyoshi.sfa.repository;

import com.shreyoshi.sfa.entity.Action;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActionRepository extends JpaRepository<Action, Long> {

    List<Action> findByDecision_Id(Long decisionId);

    List<Action> findByStatus(Action.ActionStatus status);
}