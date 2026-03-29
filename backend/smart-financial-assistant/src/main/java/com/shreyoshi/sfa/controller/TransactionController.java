package com.shreyoshi.sfa.controller;

import com.shreyoshi.sfa.entity.Transaction;
import com.shreyoshi.sfa.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @GetMapping
    public ResponseEntity<List<Transaction>> getAll() {
        return ResponseEntity.ok(transactionService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Transaction> getById(@PathVariable Long id) {
        return ResponseEntity.ok(transactionService.getById(id));
    }

    @GetMapping("/vendor/{vendorName}")
    public ResponseEntity<List<Transaction>> getByVendor(@PathVariable String vendorName) {
        return ResponseEntity.ok(transactionService.getByVendor(vendorName));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Transaction>> getByStatus(@PathVariable Transaction.TransactionStatus status) {
        return ResponseEntity.ok(transactionService.getByStatus(status));
    }

    @PostMapping
    public ResponseEntity<Transaction> create(@RequestBody Transaction transaction) {
        return ResponseEntity.ok(transactionService.save(transaction));
    }
}