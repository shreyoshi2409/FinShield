package com.shreyoshi.sfa.repository;

import com.shreyoshi.sfa.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    Optional<Transaction> findByTransactionRef(String transactionRef);

    List<Transaction> findByVendorName(String vendorName);

    List<Transaction> findByStatus(Transaction.TransactionStatus status);
}