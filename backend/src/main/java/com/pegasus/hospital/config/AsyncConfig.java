package com.pegasus.hospital.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;
import java.util.concurrent.ThreadPoolExecutor;

/**
 * 异步任务配置类
 * 
 * 配置线程池用于处理异步任务（如Excel导入、PDF生成等）
 * 体现多线程技术的使用
 * 
 * @author Pegasus Hospital Team
 */
@Configuration
@EnableAsync
public class AsyncConfig {
    
    /**
     * 自定义线程池
     * 用于处理异步任务
     */
    @Bean("taskExecutor")
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        
        // 核心线程数
        executor.setCorePoolSize(5);
        
        // 最大线程数
        executor.setMaxPoolSize(20);
        
        // 队列容量
        executor.setQueueCapacity(100);
        
        // 线程名前缀
        executor.setThreadNamePrefix("Hospital-Async-");
        
        // 线程空闲时间
        executor.setKeepAliveSeconds(60);
        
        // 拒绝策略：由调用线程处理
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        
        // 等待所有任务完成后再关闭
        executor.setWaitForTasksToCompleteOnShutdown(true);
        
        // 最大等待时间
        executor.setAwaitTerminationSeconds(60);
        
        executor.initialize();
        return executor;
    }
}
