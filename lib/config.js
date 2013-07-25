module.exports = {
  port: parseInt(process.env.PORT || 3000, 10),
  ip_address: process.env.IP_ADDRESS || '127.0.0.1',
  mode: process.env.MODE || 'dev',
  secret: process.env.SECRET || 'attack at dawn!!!'
};

