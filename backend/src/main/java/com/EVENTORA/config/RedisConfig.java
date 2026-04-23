package com.EVENTORA.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;

/**
 * RedisConfig — provides a single RedisTemplate<String, String> used across:
 *
 *   Seat Locking:    seat_lock:{seatId}            → userId       (TTL = 5 min)
 *   Payment Orders:  payment:order:{razorpayOrderId} → bookingId   (TTL = 15 min)
 *   Payment Status:  payment:status:{bookingId}      → hash map    (TTL = 30 min)
 *   Movie Cache:     movies:all / movies:location:*  → JSON list   (TTL = 10 min)
 */
@Configuration
public class RedisConfig {

    @Bean
    public RedisTemplate<String, String> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, String> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(new StringRedisSerializer());
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setHashValueSerializer(new StringRedisSerializer());
        template.afterPropertiesSet();
        return template;
    }
}
