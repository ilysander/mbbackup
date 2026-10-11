require 'json'

package = JSON.parse(File.read('../package.json'))

Pod::Spec.new do |s|
  s.name         = "RNSelphiFacePluginModule"
  s.version      = package['version']
  s.summary      = package['description']
  s.description  = <<-DESC
                  Selphi plugin for React Native
                   DESC
  s.homepage     = "http://www.facephi.com"
  s.license      = "MIT"
  s.platform            = :ios, "9.0"
  s.author           = { 'Facephi' => 'support@facephi.com' }
  s.source              = { :git => "." }
  
  s.source_files        = "*.{h,m}"
  s.public_header_files = '*.h'
  s.resources = ['Resources/fphi-selphi-widget-resources-selphi-live-1.2.zip']
  s.preserve_paths      = "*.js"
  s.vendored_frameworks = 'Frameworks/FPhiWidgetSelphi.xcframework', 'Frameworks/FPhiWidgetCore.xcframework', 'Frameworks/FPBExtractoriOS.xcframework'
  
  s.dependency "zipzap"
  s.dependency "React"

end