package com.EVENTORA.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class PaymentOrderDTO {
    private String orderId;          // Razorpay order_id
    private String bookingId;
    private String bookingReference;
    private BigDecimal amount;       // in INR
    private long amountInPaise;      // amount * 100 for Razorpay
    private String currency;
    private String razorpayKeyId;    // public key sent to frontend
    private String eventTitle;
    private String customerName;
    private String customerEmail;
}
