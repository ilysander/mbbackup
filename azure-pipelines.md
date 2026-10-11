Mibanco Móvil Pipeline
==========================

Pipeline de Integración Continua correspondiente al repositorio del aplicativo móvilde Mi Banco

> Para más información acerca de las configurciones realizadas para el build del proyecto puedes ir al documento [Configuración del proyecto ](/README.md) 

# Ejecución

# Configuración

Los certificados de iOS y android son obtenidos de la Bóveda de Secretos, **VAULT** . Dentro esta bóveda los certificados están organizados por ambientes: desarrollo, calidad y producción.
Para poder acceder configurar la ruta del VAULT donde se encuentran estos certificados, se hace unos de la variable `strKVEnginePath`, la cual depende del `lane` y la rama desde la cual se esta ejecutando el pipeline.

- Rama `demo`:
```bash
lane:  demo
strKVEnginePath: desarrollo
```

- Rama `dev`:
```bash
lane:  dev
strKVEnginePath: desarrollo
```

- Rama `qa`:
```bash
lane:  qa
strKVEnginePath: calidad
```

- Rama `staging`:
```bash
lane:  release
strKVEnginePath: producción
```

- Rama diferente a las anteriores mencionadas:
```bash
lane:  demo
strKVEnginePath: desarrollo
```

> Cuando se realiza el build del lane de `demo` la variable `strKVEnginePath` toma 2 valores durante la ejecución del build, ya que para el caso de iOS, se hacen uso de los certificados de calidad.

# Ejecución

## Preparación
Considerar que la ejecución del pipeline hace uso de las siguientes variables: 
- `flag-jscrambler` : Variable mandatoria para activar o desactivar el jscrambler
 - `steps_switch` : Variable indica que acción deseas realizar. 
 - `wait_time_seconds` :  Variable que indica el tiempo de espera en segundos. Este tiempo permite solicitar al equipo de seguridad que habilite el firewall en base a la IP obtenida del agente MacOS y poder continuar con el uso de JSCrambler. Esta variable es usada cuando el jscrambler_switch es `true`.
 - `rb.dev.role_id` : Rol para conectarse a los recursos del ambiente de desarrollo del VAULT
 - `rb.qa.secret_id` : Secreto del rol de desarrollo para conectarse a los recursos del ambiente de desarrollo del VAULT
 - `rb.calidad.role_id` : Rol para conectarse a los recursos del ambiente de calidad del VAULT
 - `rb.calidad.secret_id` : Secreto del rol de calidad para conectarse a los recursos del ambiente de calidad del VAULT
 - `role_id` :  Rol para conectarse al VAULT y consumir recursos.
 - `secret_id` : Secreto del rol para conectarse al VAULT y consumir recursos.

### Acciones de steps_switch
Por defecto están activas todas las acciones:
```
build_android build_ios idc_scan sonatype_scan sast_scan
```
 - `build_ios:`  Variable que permite activar la compilación de iOS.
 - `build_android:`  Variable que permite activar compilación de Android.
 - `sast_scan:`  Variable que permite activar el análisis estático de seguridad de apicaciones(SAST), para detectar vulnerabilidades en el código fuente desarrollado.
 - `sonatype_scan:`  Variable que permite activar el análisis de componentes de terceros(SCA), para detectar vulnerabilidades en las dependencias usadas.
 - `idc_scan:`  Variable que permite activar la inspección de código (IDC), para detectar defectos en el código fuente desarrollado.

### Nota
 - **Proceso alternativo para uso de JScrambler**: En este proceso, se solicita a Seguridad que den permiso a la IP del agente en la que se esta ejecutando el build del pipeline, para poder acceder al JScrambler.
