Modificaciones necesarias en base de datos SAGIR:

1- Tabla "Caracteristicas_proyectos"
create table sagir.caracteristicas_proyetos(
	id int primary key auto_increment,
    id_proyecto int,
    piramidal int
);

2- Tabla "comuna_categorias"
CREATE TABLE `comuna_categoria` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `comuna_id` int(11) DEFAULT NULL,
  `comuna_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=333 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci

//-- RESPALDAR DESDE BD ACTIS

3- Procedimiento almacenado get_comunas_rm

CREATE  PROCEDURE `get_comunas_rm`()
BEGIN
	select
	c.id as idComuna,
	c.name as nomComuna ,
	p.id as idProvincia,
	p.name as nomProvincia,
	r.id as idRegion,
	r.name as nomRegion
from
	comunas c,
	provincias p,
	regiones r

where
	c.provincia_id = p.id
	AND r.id = p.regione_id
	AND r.id = 7;
	
END

4- Procedimiento almacenado "get_ficha_tecnica_data"

CREATE PROCEDURE `get_ficha_tecnica_data`( 
    IN category VARCHAR(50), 
    IN subcategory VARCHAR(50), 
    IN initDate VARCHAR(20),
    IN endDate VARCHAR(20),
    IN type VARCHAR(10),
    IN town int,
    IN prov int
)
BEGIN
    DECLARE sql_query VARCHAR(1000);

    SET @sql_query = '
        SELECT  
            proyectos.id, 
            proyectos.name,
            proyectos.created, 
            proyectos.descripcion,
            proyectos.costo_total,
            proyectos.observacion,
            proyectos.tipo_alcance_id,
            comunas.name town_name,
            comunas.id as comuna_id,
            alcance.name alcance_nombre,
            alcance.codigo alcance_code,
            alcance.id alcance_id,
            area.name area_name,
            area.id area_id,
            prog_tip.id tip_id,
            prog_tip.name tip_name,
            sec.name sector_name,
            ec.name estado_core_name,
            es.name estado_situacion_name,
            proyectos.beneficiarios_hombres,
            proyectos.beneficiarios_mujeres,
            proyectos.beneficiarios_total,
            IFNULL(cc.name,\'Urbana\') category,
            proyectos.es_provincial
        
        FROM 
            sagir.proyectos proyectos , 
            sagir.proyectos_comunas comunas_proy, 
            sagir.comunas comunas left join sagir.comuna_categoria cc on comunas.id = cc.comuna_id,
            sagir.tipo_alcances alcance,
            sagir.prog_areas area,
            sagir.prog_tipologias prog_tip,
            sagir.sectores sec,
            sagir.estados_cores ec,
            sagir.estado_situaciones es
            
			
        WHERE 
            proyectos.id  = comunas_proy.proyecto_id
        AND   
            comunas_proy.comuna_id = comunas.id 
        AND
			alcance.id = proyectos.tipo_alcance_id
		AND
			area.id = proyectos.prog_area_id
		AND
			prog_tip.id = proyectos.prog_tipologia_id
		AND
			sec.id = proyectos.sectore_id
		AND
			ec.id = proyectos.estado_core_id
		AND
			es.id = proyectos.estado_situacione_id';
            
	IF ( category != '' ) THEN
        SET @sql_query = CONCAT(@sql_query, ' AND UPPER(area.name) LIKE UPPER(\'%');
        SET @sql_query = CONCAT(@sql_query,  category);
        SET @sql_query = CONCAT(@sql_query, '%\')');
    END IF;
    
    IF ( subcategory != '' ) THEN
        SET @sql_query = CONCAT(@sql_query, ' AND UPPER(prog_tip.name) LIKE UPPER(\'%');
        SET @sql_query = CONCAT(@sql_query,  subcategory);
        SET @sql_query = CONCAT(@sql_query, '%\')');
    END IF;

    IF ( initDate != '' ) THEN
        SET @sql_query = CONCAT(@sql_query, ' AND YEAR(proyectos.created) >= YEAR(STR_TO_DATE(');
        SET @sql_query = CONCAT(@sql_query,  initDate);
        SET @sql_query = CONCAT(@sql_query, ', \'%Y\')) ');
    END IF;
    
    IF ( endDate != '' ) THEN
        SET @sql_query = CONCAT(@sql_query, ' AND YEAR(proyectos.created) <= YEAR(STR_TO_DATE(');
        SET @sql_query = CONCAT(@sql_query,  endDate);
        SET @sql_query = CONCAT(@sql_query, ', \'%Y\')) ');
    END IF;
    
    IF ( type != '' ) THEN
		SET @sql_query = CONCAT(@sql_query, ' AND UPPER(cc.name) LIKE UPPER(\'%');
        SET @sql_query = CONCAT(@sql_query,  type);
        SET @sql_query = CONCAT(@sql_query, '%\')');
    END IF;
    
    IF ( town != 0 ) THEN
        SET @sql_query = CONCAT(@sql_query, ' AND comunas.id  = ');
        SET @sql_query = CONCAT(@sql_query,  town);
    END IF;
    
    IF ( prov != 0 ) THEN
        SET @sql_query = CONCAT(@sql_query, ' AND proyectos.es_provincial  = ');
        SET @sql_query = CONCAT(@sql_query,  prov);
    END IF;
    
    
    SET @sql_query = CONCAT(@sql_query, ';');
    
    PREPARE stmt FROM @sql_query;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END


Git acces tkn: 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