package com.pegasus.hospital.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.pegasus.hospital.entity.Admin;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

/**
 * 管理员Mapper接口
 * 
 * @author Pegasus Hospital Team
 */
@Mapper
public interface AdminMapper extends BaseMapper<Admin> {
    
    /**
     * 根据用户名查询管理员
     */
    @Select("SELECT * FROM admin WHERE username = #{username}")
    Admin selectByUsername(String username);
}
