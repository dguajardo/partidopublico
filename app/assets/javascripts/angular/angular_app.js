function scroll_to_top() {
    $('html, body').animate({
        scrollTop: $('#container').offset().top
    }, 500);
}

var app = angular.module('papuApp',[ 'ui.bootstrap', 'ng-rails-csrf', 'ngRoute', 'ngAside', 'flow', 'angularUtils.directives.dirPagination']);

app.config(['$routeProvider', '$locationProvider', function AppConfig($routeProvider, $locationProvider) {
 $locationProvider.html5Mode(true);
}]);

app.controller("personasController",personasController);
personasController.$inject = ["$scope","$http","$location","$aside","$attrs"];

function personasController($scope,$http,$location,$aside,$attrs){
  $scope.persona = {};
  $scope.personas = [];
  $scope.partido_id = $location.path().split("/")[2];
  $scope.pageSize = 5;

  var save_or_update_persona = function() {
    if($scope.persona.id) {
      $scope.persona.partido_id = $scope.partido_id
      $http.put('/personas/'+$scope.persona.id, $scope.persona)
        .success(function(data){
          getPersonasByPartido($scope.partido_id)
          scroll_to_top();
        })
        .error(function (){
          $scope.messages = { response: false, message: $attrs.errorupdatingask }
          scroll_to_top();
        });
    }
    else {
      $http.post('/partidos/'+$scope.partido_id+'/personas/', $scope.persona)
        .success(function(data){
          $scope.persona = data;
          getPersonasByPartido($scope.partido_id)
          scroll_to_top();
        })
        .error(function (){
          $scope.messages = { response: false, message: $attrs.errorcreatingask }
          scroll_to_top();
        });
    }
  }

  function getPersonasByPartido(partido_id) {
    $http.get('partidos/'+partido_id+'/personas')
      .success( function(data){
        $scope.personas = data;
      })
      .error( function(error_data){
        $scope.messages = {response: false, message: error_data}
      })
  }

  function getPersonaInfo(persona_id) {
    $scope.persona = {};
    if(persona_id) {
      $http.get('personas/'+persona_id+'.json')
        .success( function(data){
          $scope.persona = data;
        })
        .error( function(error_data){
          $scope.messages = {response: false, message: error_data}
        })
    }
  }

  $scope.getPersonaModal = function(persona_id){
    getPersonaInfo(persona_id);
    $aside.open({
      templateUrl: 'persona_modal_aside.html',
      scope: $scope,
      placement: 'left',
      size: 'lg',
      backdrop: true,
      controller: function($scope,$uibModalInstance){
        $scope.save = function(e) {
          save_or_update_persona();
          $uibModalInstance.close();
          e.stopPropagation();
        };
        $scope.cancel = function(e) {
          $uibModalInstance.close();
          e.stopPropagation();
        };
      }
    });
  }

  $scope.removePersona = function (persona) {
    if (confirm('Seguro desea eliminar esta Persona?')) {
      $http.delete('/partidos/' + $scope.partido_id + '/personas/' + persona.id);
      $scope.personas.splice($scope.personas.indexOf(persona), 1);
    }
  }

  getPersonasByPartido($scope.partido_id);
};

app.controller("cargosController",cargosController);
cargosController.$inject = ["$scope","$http","$location","$aside","$attrs"];

function cargosController($scope,$http,$location,$aside,$attrs){
  $scope.cargos = [];
  $scope.personas = [];
  $scope.partido_id = $location.path().split("/")[2];
  $scope.pageSize = 5;

  var save_or_update_cargo = function() {
    if($scope.cargo.id) {
      $http.put('/cargos/'+$scope.cargo.id, $scope.cargo)
        .success(function(data){
          getCargosByPartido($scope.partido_id);
        })
        .error(function (){
          $scope.messages = { response: false, message: $attrs.errorupdatingask }
          scroll_to_top();
        });
    }
    else {
      $http.post('/cargos/', $scope.cargo)
        .success(function(data){
          getCargosByPartido($scope.partido_id);
        })
        .error(function (){
          $scope.messages = { response: false, message: $attrs.errorcreatingask }
          scroll_to_top();
        });
    }
  }

  function getRegions() {
    $http.get('partidos/'+$scope.partido_id+'/regions')
      .success( function(data){
        $scope.regions = data;
      })
      .error( function(error_data){
        $scope.messages = {response: false, message: error_data}
      })
  }

  function getComunas() {
    $http.get('partidos/'+$scope.partido_id+'/comunas')
      .success( function(data){
        $scope.comunas = data;
      })
      .error( function(error_data){
        $scope.messages = {response: false, message: error_data}
      })
  }

  function getCargosByPartido(partido_id) {
    $http.get('partidos/'+partido_id+'/cargos')
      .success( function(data){
        $scope.cargos = data;
      })
      .error( function(error_data){
        $scope.messages = {response: false, message: error_data}
      })
  }

  function getTipoCargos(partido_id) {
    $http.get('partidos/'+partido_id+'/tipo_cargos')
      .success( function(data){
        $scope.tipo_cargos = data;
      })
      .error( function(error_data){
        $scope.messages = {response: false, message: error_data}
      })
  }

  function getPersonasByPartido(partido_id) {
    $http.get('partidos/'+partido_id+'/personas')
      .success( function(data){
        $scope.personas = data;
      })
      .error( function(error_data){
        $scope.messages = {response: false, message: error_data}
      })
  }

  function getCargoInfo(cargo_id) {
    $http.get('cargos/'+cargo_id+'.json')
      .success( function(data){
        $scope.cargo = data;
        $scope.cargo.fecha_desde = new Date(data.fecha_desde);
        $scope.cargo.fecha_hasta = new Date(data.fecha_hasta);
      })
      .error( function(error_data){
        $scope.messages = {response: false, message: error_data}
      })
  }

  $scope.getCargoModal = function(cargo_id){
    if(cargo_id) {
      getCargoInfo(cargo_id);
    } else {
      $scope.cargo = {
        partido_id: $scope.partido_id
      };
    }
    $aside.open({
      templateUrl: 'cargo_modal_aside.html',
      scope: $scope,
      placement: 'left',
      size: 'lg',
      backdrop: true,
      controller: function($scope,$uibModalInstance){
        $scope.save = function(e) {
          save_or_update_cargo();
          $uibModalInstance.close();
          e.stopPropagation();
        };
        $scope.cancel = function(e) {
          $uibModalInstance.close();
          e.stopPropagation();
        };
      }
    });
  }

  $scope.removeCargo = function(cargo) {
    if (confirm('Seguro desea eliminar este Cargo?')) {
      $http.delete('/partidos/' + $scope.partido_id + '/cargos/' + cargo.id);
      $scope.cargos.splice($scope.cargos.indexOf(cargo), 1);
    }
  }

  getCargosByPartido($scope.partido_id);
  getPersonasByPartido($scope.partido_id);
  getTipoCargos($scope.partido_id);
  getRegions();
  getComunas();
};

app.controller("sedesController",sedesController);
sedesController.$inject = ['$scope','$http','$location','$aside','$attrs'];

function sedesController($scope,$http,$location,$aside,$attrs){
  $scope.sedes = [];
  $scope.partido_id = $location.path().split("/")[2];
  $scope.pageSize = 5;

  var save_or_update_sede = function() {
    if($scope.sede.id) {
      $http.put('/sedes/'+$scope.sede.id, $scope.sede)
        .success(function(data){
          getSedesByPartido($scope.partido_id);
        })
        .error(function (){
          $scope.messages = { response: false, message: $attrs.errorupdatingask }
          scroll_to_top();
        });
    }
    else {
      $http.post('/sedes/', $scope.sede)
        .success(function(data){
          getSedesByPartido($scope.partido_id);
        })
        .error(function (){
          $scope.messages = { response: false, message: $attrs.errorcreatingask }
          scroll_to_top();
        });
    }
  }

  function getRegions() {
    $http.get('partidos/'+$scope.partido_id+'/regions')
      .success( function(data){
        $scope.regions = data;
      })
      .error( function(error_data){
        $scope.messages = {response: false, message: error_data}
      })
  }

  function getComunas() {
    $http.get('partidos/'+$scope.partido_id+'/comunas')
      .success( function(data){
        $scope.comunas = data;
      })
      .error( function(error_data){
        $scope.messages = {response: false, message: error_data}
      })
  }

  function getSedesByPartido(partido_id) {
    $http.get('partidos/'+partido_id+'/sedes')
      .success( function(data){
        $scope.sedes = data;
      })
      .error( function(error_data){
        $scope.messages = {response: false, message: error_data}
      })
  }

  function getSedeInfo(sede_id) {
    $http.get('sedes/'+sede_id+'.json')
      .success( function(data){
        $scope.sede = data;
      })
      .error( function(error_data){
        $scope.messages = {response: false, message: error_data}
      })
  }

  $scope.getSedeModal = function(sede_id){
    if(sede_id) {
      getSedeInfo(sede_id);
    } else {
      $scope.sede = {
        partido_id: $scope.partido_id
      };
    }
    $aside.open({
      templateUrl: 'sede_modal_aside.html',
      scope: $scope,
      placement: 'left',
      size: 'lg',
      backdrop: true,
      controller: function($scope,$uibModalInstance){
        $scope.save = function(e) {
          save_or_update_sede();
          $uibModalInstance.close();
          e.stopPropagation();
        };
        $scope.cancel = function(e) {
          $uibModalInstance.close();
          e.stopPropagation();
        };
      }
    });
  }

  $scope.removeSede = function (sede) {
    if (confirm('Seguro desea eliminar esta Sede?')) {
      $http.delete('/partidos/' + $scope.partido_id + '/sedes/' + sede.id);
      $scope.sedes.splice($scope.sedes.indexOf(sede), 1);
    }
}

  getSedesByPartido($scope.partido_id);
  getRegions();
  getComunas();
};

app.controller("actividad_publicasController",actividad_publicasController);
actividad_publicasController.$inject = ["$scope","$http","$location","$aside","$attrs"];

function actividad_publicasController($scope,$http,$location,$aside,$attrs){
  $scope.actividad_publicas = [];
  $scope.partido_id = $location.path().split("/")[2];

  var save_or_update_actividad_publica = function() {
    if($scope.actividad_publica.id) {
      $http.put('/actividad_publicas/'+$scope.actividad_publica.id, $scope.actividad_publica)
        .success(function(data){
          getActividadesPublicassByPartido($scope.partido_id);
        })
        .error(function (){
          $scope.messages = { response: false, message: $attrs.errorupdatingask }
          scroll_to_top();
        });
    }
    else {
      console.log($scope.actividad_publica)
      $http.post('/actividad_publicas/', $scope.actividad_publica)
        .success(function(data){
          getActividadesPublicassByPartido($scope.partido_id);
        })
        .error(function (){
          $scope.messages = { response: false, message: $attrs.errorcreatingask }
          scroll_to_top();
        });
    }
  }

  function getActividadesPublicassByPartido(partido_id) {
    $http.get('partidos/'+partido_id+'/actividad_publicas')
      .success( function(data){
        console.log(data);
        $scope.actividad_publicas = data;
      })
      .error( function(error_data){
        $scope.messages = {response: false, message: error_data}
      })
  }

  function getActividadPublicaInfo(actividad_publica_id) {
    $http.get('actividad_publicas/'+actividad_publica_id+'.json')
      .success( function(data){
        $scope.actividad_publica = data;
      })
      .error( function(error_data){
        $scope.messages = {response: false, message: error_data}
      })
  }

  $scope.getActividadPublicaModal = function(actividad_publica_id){
    if(actividad_publica_id) {
      getActividadPublicaInfo(actividad_publica_id);
    } else {
      $scope.actividad_publica = {
        partido_id: $scope.partido_id
      };
    }
    $aside.open({
      templateUrl: 'actividad_publica_modal_aside.html',
      scope: $scope,
      placement: 'left',
      size: 'lg',
      backdrop: true,
      controller: function($scope,$uibModalInstance){
        $scope.save = function(e) {
          save_or_update_actividad_publica();
          $uibModalInstance.close();
          e.stopPropagation();
        };
        $scope.cancel = function(e) {
          $uibModalInstance.close();
          e.stopPropagation();
        };
      }
    });
  }

  getActividadesPublicassByPartido($scope.partido_id);
};

app.controller("afiliacionsController", afiliacionsController);
afiliacionsController.$inject = ["$scope","$http","$location","$aside","$attrs"];

function afiliacionsController($scope,$http,$location,$aside,$attrs){
  $scope.actividad_publicas = [];
  $scope.partido_id = $location.path().split("/")[2];

  function getDatosAgregadosByPartido(partido_id) {
    $http.get('partidos/'+partido_id+'/afiliacions/aggregate')
      .success( function(data){
        $scope.datos_afiliacion = data;
      })
      .error( function(error_data){
        $scope.messages = {response: false, message: error_data}
      })
  }

  $scope.postEliminarDatosAfiliacion = function(fecha_datos){
    fecha_eliminacion = {fecha_datos}
    $http.post('partidos/'+$scope.partido_id+'/afiliacions/eliminar', fecha_eliminacion)
      .success( function(data){
        $scope.datos_eliminacion = data;
      })
      .error( function(error_data){
        $scope.messages = {response: false, message: error_data}
      })
  }


  getDatosAgregadosByPartido($scope.partido_id);

}
