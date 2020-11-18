package setting

import (
	"os"
	"time"

	"github.com/go-ini/ini"
	log "github.com/sirupsen/logrus"
)

type App struct {
	JwtSecret string
	PageSize  int
	PrefixUrl string

	RuntimeRootPath string

	LogSavePath string
	LogSaveName string
	LogFileExt  string
	TimeFormat  string
}

var AppSetting = &App{}

type Server struct {
	RunMode      string
	HttpPort     int
	ReadTimeout  time.Duration
	WriteTimeout time.Duration
}

var ServerSetting = &Server{}

type Database struct {
	Type        string
	User        string
	Password    string
	Host        string
	Port        string
	Name        string
	SslMode     string
	TablePrefix string
}

var DatabaseSetting = &Database{
	SslMode: "disable",
}

type Redis struct {
	Host        string
	Password    string
	MaxIdle     int
	MaxActive   int
	IdleTimeout time.Duration
}

var RedisSetting = &Redis{}

var cfg *ini.File

func loadIni() (*ini.File, error) {
	var err error
	// Check for global ini file
	cfg, err = ini.Load("/etc/tumbo/tumbo.ini")
	if err != nil {
		log.Warn("setting.Setup, failed to open global ini file")
	}

	if cfg != nil {
		log.Info("Config loaded from /etc/tumbo/tumbo.ini")
		return cfg, nil
	}

	// if /etc/tumbo/conf/app.ini is not found, use the local instance.
	cfg, err = ini.Load("configs/app.ini")
	if err != nil {
		log.Fatalf("setting.Setup, fail to parse 'configs/app.ini': %v", err)
		return nil, err
	}

	return cfg, nil

}

// Setup initialize the configuration instance
func Setup() {
	var err error

	cfg, err = loadIni()
	if err != nil {
		log.Fatalf("setting.Setup, fail to parse 'configs/app.ini': %v", err)
	}

	mapTo("app", AppSetting)
	mapTo("server", ServerSetting)
	mapTo("database", DatabaseSetting)
	mapTo("redis", RedisSetting)

	// Overwrite settings from ini file
	if e := os.Getenv("DB_HOST"); e != "" {
		DatabaseSetting.Host = e
	}

	if e := os.Getenv("DB_PORT"); e != "" {
		DatabaseSetting.Port = e
	}

	if e := os.Getenv("DB_USERNAME"); e != "" {
		DatabaseSetting.User = e
	}

	if e := os.Getenv("DB_PASSWORD"); e != "" {
		DatabaseSetting.Password = e
	}

	if e := os.Getenv("DB_NAME"); e != "" {
		DatabaseSetting.Name = e
	}

	ServerSetting.ReadTimeout = ServerSetting.ReadTimeout * time.Second
	ServerSetting.WriteTimeout = ServerSetting.WriteTimeout * time.Second
	RedisSetting.IdleTimeout = RedisSetting.IdleTimeout * time.Second
}

// mapTo map section
func mapTo(section string, v interface{}) {
	err := cfg.Section(section).MapTo(v)
	if err != nil {
		log.Fatalf("Cfg.MapTo %s err: %v", section, err)
	}
}
