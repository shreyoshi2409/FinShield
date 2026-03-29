package com.shreyoshi.sfa.service;

import com.shreyoshi.sfa.entity.Transaction;
import com.shreyoshi.sfa.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;

    public Transaction save(Transaction transaction) {
        return transactionRepository.save(transaction);
    }

    public List<Transaction> getAll() {
        return transactionRepository.findAll();
    }

    public Transaction getById(Long id) {
        return transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found with id: " + id));
    }

    public List<Transaction> getByVendor(String vendorName) {
        return transactionRepository.findByVendorName(vendorName);
    }

    public List<Transaction> getByStatus(Transaction.TransactionStatus status) {
        return transactionRepository.findByStatus(status);
    }
}