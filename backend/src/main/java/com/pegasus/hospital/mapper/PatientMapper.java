package com.pegasus.hospital.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.pegasus.hospital.entity.Patient;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

/**
 * 患者Mapper接口
 * 
 * @author Pegasus Hospital Team
 */
@Mapper
public interface PatientMapper extends BaseMapper<Patient> {
    
    /**
     * 根据患者ID查询
     */
    @Select("SELECT * FROM patient WHERE patient_id = #{patientId}")
    Patient selectByPatientId(String patientId);
    
    /**
     * 根据身份证号查询
     */
    @Select("SELECT * FROM patient WHERE identity_id = #{identityId}")
    Patient selectByIdentityId(String identityId);
    
    /**
     * 获取最大患者ID
     */
    @Select("SELECT MAX(patient_id) FROM patient")
    String selectMaxPatientId();
}
