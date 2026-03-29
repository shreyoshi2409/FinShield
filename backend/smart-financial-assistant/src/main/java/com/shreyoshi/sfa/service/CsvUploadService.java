package com.shreyoshi.sfa.service;

import com.shreyoshi.sfa.entity.Transaction;
import com.shreyoshi.sfa.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CsvUploadService {

    private final TransactionRepository transactionRepository;

    private static final DateTimeFormatter[] FORMATTERS = {
            DateTimeFormatter.ISO_LOCAL_DATE_TIME,
            DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss"),
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"),
            DateTimeFormatter.ofPattern("yyyy-MM-dd")
    };

    private LocalDateTime parseDate(String value) {
        if (value == null || value.isBlank()) return null;
        for (DateTimeFormatter fmt : FORMATTERS) {
            try {
                return LocalDateTime.parse(value.trim(), fmt);
            } catch (DateTimeParseException ignored) {}
        }
        return null;
    }

    private String safeGet(CSVRecord record, String key) {
        try {
            return record.get(key);
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    public List<Transaction> uploadCSV(MultipartFile file) {
        List<Transaction> saved = new ArrayList<>();

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream()));
             CSVParser csvParser = new CSVParser(reader,
                     CSVFormat.DEFAULT.withFirstRecordAsHeader()
                             .withIgnoreHeaderCase()
                             .withTrim())) {

            for (CSVRecord record : csvParser) {
                String ref      = safeGet(record, "transaction_ref");
                String vendor   = safeGet(record, "vendor_name");
                String amtStr   = safeGet(record, "amount");
                String currency = safeGet(record, "currency");
                String category = safeGet(record, "category");
                String dept     = safeGet(record, "department");
                String desc     = safeGet(record, "description");
                String dueDateStr = safeGet(record, "due_date");

                if (ref == null || vendor == null || amtStr == null) continue;

                Transaction transaction = Transaction.builder()
                        .transactionRef(ref)
                        .vendorName(vendor)
                        .amount(new BigDecimal(amtStr))
                        .currency(currency != null ? currency : "INR")
                        .category(category)
                        .department(dept)
                        .description(desc)
                        .dueDate(parseDate(dueDateStr))
                        .status(Transaction.TransactionStatus.PENDING)
                        .transactionDate(LocalDateTime.now())
                        .build();

                saved.add(transactionRepository.save(transaction));
            }

        } catch (Exception e) {
            throw new RuntimeException("Failed to parse CSV: " + e.getMessage());
        }

        return saved;
    }
}