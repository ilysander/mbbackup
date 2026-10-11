require "json"

package = JSON.parse(File.read('../package.json'))

Pod::Spec.new do |s|
  s.name         = "RNSelphidPluginModule"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.description  = <<-DESC
                  react-native-selphid-plugin
                   DESC
  s.homepage     = "http://www.facephi.com"
  s.license      = "MIT"
  s.authors      = { "Your Name" => "support@facephi.com" }
  
  s.platform     = :ios, "9.0"
  s.source       = { :git => "." }
  s.source_files = '*.{h,m}'
  s.public_header_files = '*.h'

  #s.vendored_frameworks = 'Frameworks/FPhiSelphIDWidgetiOS.xcframework'
  s.resources = ['Resources/fphi-selphid-widget-resources-selphid-1.0-custom.zip']
  
  s.dependency 'FPhiSelphIDWidgetiOSSim'
  s.dependency "React"
  s.dependency "zipzap"
  #s.dependency 'GoogleMLKit/TextRecognition'  
  s.dependency 'FPhiMBWidgetiOS'
end
