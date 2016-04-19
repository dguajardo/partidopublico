class PartidoStepsController < ApplicationController
    include Wicked::Wizard
    helper  :all
    
    before_action :set_partido
        
    
        
    steps   :datos_basicos, 
    
            :normas_internas, 
    
            :regiones, :sedes, :num_afiliados, :tramites, :representantes, :autoridades,
            
            :postulacion_popular, :organos_internos, :postulacion_interna, :agenda_presidente, :actividades_publicas,
            
            :publicacion_candidatos, :acuerdos_organos, :resultados_elecciones_internas,
            
            :entidades_participadas, :pactos_electorales, :interes_patrimonio,
            
            :linea_denuncia, :sanciones
    
    def show
        # @user = current_user
        # @partido = Partido.find_by_user_id(current_user.id)
        puts "----------------->  Show::"+step.to_s
        case step
        when :datos_basicos
            
        when :normas_internas
        
        when :regiones
            
        when :sedes
            @partido.regions.each do |r|
                if @partido.sedes.find_by_region(r.to_s).blank?
                    @partido.sedes << Sede.new(region:r)
                end
            end
        
        when :num_afiliados
            @partido.regions.each do |r|
                if @partido.afiliacions.find_by_region(r.to_s).blank?
                    @partido.afiliacions << Afiliacion.new(region:r)
                end
            end
        
        when :tramites
            @partido.tramites.each do |tramite|
                tramite.requisitos.each do |requisito|
                end
                tramite.procedimientos.each do |procedimiento|
                end
            end
        
        end
        render_wizard
    end
    
    def update
        # puts params[:partido]
        # @partido = Partido.find_by_user_id(current_user.id)
        puts "----------------->  Update::"+step.to_s
        case step
        # when :datos_basicos
        #     @partido.update_attributes(partido_params)
        
        when :normas_internas
            puts @partido.marco_interno.to_yaml
            puts marco_interno_params.to_yaml
            @partido.marco_interno.update(marco_interno_params)
        
        # when :regiones
        #     @partido.update_attributes(partido_params)
        
        # when :sedes
        #     @partido.update_attributes(partido_params)
        
        # when :num_afiliados
        #     @partido.update_attributes(partido_params)
        
        # when :tramites
        #     @partido.update_attributes(partido_params)
                
        # when :representantes
        #     @partido.update_attributes(partido_params)
        
        # when :autoridades
        #     @partido.update_attributes(partido_params)
                
        # when :postulacion_popular
        #     @partido.update_attributes(partido_params)
                
        else
            @partido.update_attributes(partido_params)
        end
        render_wizard @partido
    end
  
    private
        # Use callbacks to share common setup or constraints between actions.
        def set_partido
          @partido = Partido.find params[:partido_id]
        end
    
        # Never trust parameters from the scary internet, only allow the white list through.
        def partido_params
          params.require(:partido).permit(:nombre, :sigla, :lema, :fecha_fundacion, :texto, :logo,
                                                    sedes_attributes: [:id, :region, :direccion, :contacto, :_destroy],
                                                    afiliacions_attributes: [:id, :region, :hombres, :mujeres, :rangos, :_destroy],
                                                    tramites_attributes: [:id, :nombre, :descripcion, :persona_id, :documento,
                                                              requisitos_attributes: [:descripcion, :id, :_destroy],
                                                              procedimientos_attributes: [:descripcion, :id, :_destroy]],
                                                    representantes_attributes: [:id, :cargo, :nombre, :apellidos, :genero, :fecha_nacimiento, :nivel_estudios,
                                                                :fecha_desde, :fecha_hasta, :email, :telefono,
                                                                :region, :comuna, :circunscripcion, :distrito, :ano_inicio_militancia, :afiliado, :bio, :_destroy],
                                                    autoridads_attributes: [:id, :cargo, :nombre, :apellidos, :genero, :fecha_nacimiento, :nivel_estudios,
                                                                :fecha_desde, :fecha_hasta, :email, :telefono,
                                                                :region, :comuna, :circunscripcion, :distrito, :ano_inicio_militancia, :afiliado, :bio, :_destroy],
                                                    eleccion_populars_attributes: [:id, :fecha_eleccion, :dias, :cargo, :_destroy,
                                                                requisitos_attributes: [:descripcion, :id, :_destroy],
                                                                procedimientos_attributes: [:descripcion, :id, :_destroy]],
                                                    organo_internos_attributes: [:nombre, :funciones, :id, :_destroy,
                                                                requisitos_attributes: [:descripcion, :id, :_destroy],
                                                                procedimientos_attributes: [:descripcion, :id, :_destroy]],
                                                    eleccion_internas_attributes:[:organo_interno_id, :fecha_eleccion, :fecha_limite_inscripcion, :cargo,
                                                                requisitos_attributes: [:descripcion, :id, :_destroy],
                                                                procedimientos_attributes: [:descripcion, :id, :_destroy]],
                                                    region_ids: []
            )
        end
        
        def marco_interno_params
          params.require(:marco_interno).permit(:partido_id, documentos_attributes: [:id, :descripcion, :archivo, :_destroy])
        end
end
