const request = require('supertest');
const server = require('../index');
const variables = require("../variables");

  describe("Customer Regstration", () => {
    test("Registration success", async () => {
      const response = await request(server)
      .post('/customers')
      .send({
        "mobile": "+8801736389284",
        "name": "sohag",
        "deviceBrand": "Android",
        "deviceId": "unknown",
        "deviceName": "Unknown",
        "deviceModel": "Google Pixel 2 - 8.0 - API 26 - 1080x1920",
        "password": "123456",
        "deviceUniqueId": "35d0a4c0fd61da82",
        "source": 1,
        "deviceIsEmulator": true,
        "deviceIsTablet": false
      })
      .set({
          'apitoken': variables.apiToken,
          'Accept': 'application/json'
      });
      expect(response.status).toEqual(response.status);
    });
    test("Registration failed with invaild phone number with special character and alphabet", async () => {
      const response = await request(server)
      .post('/customers')
      .send({
        "mobile": "+880176382A@55",
        "name": "sohag",
        "deviceBrand": "Android",
        "deviceId": "unknown",
        "deviceName": "Unknown",
        "deviceModel": "Google Pixel 2 - 8.0 - API 26 - 1080x1920",
        "password": "123456",
        "deviceUniqueId": "35d0a4c0fd61da82",
        "source": 1,
        "deviceIsEmulator": true,
        "deviceIsTablet": false
      })
      .set({
          'apitoken': variables.apiToken,
          'Accept': 'application/json'
      });
      expect(response.status).toEqual(400);
    });

    test("Registration failed with invaild phone number", async () => {
      const response = await request(server)
      .post('/customers')
      .send({
        "mobile": "+880167598686",
        "name": "sohag",
        "deviceBrand": "Android",
        "deviceId": "unknown",
        "deviceName": "Unknown",
        "deviceModel": "Google Pixel 2 - 8.0 - API 26 - 1080x1920",
        "password": "123456",
        "deviceUniqueId": "35d0a4c0fd61da82",
        "source": 1,
        "deviceIsEmulator": true,
        "deviceIsTablet": false
      })
      .set({
          'apitoken': variables.apiToken,
          'Accept': 'application/json'
      });
      expect(response.status).toEqual(400);
    });

    test("Registration failed with  phone number more than 14 digit", async () => {
      const response = await request(server)
      .post('/customers')
      .send({
        "mobile": "+88016759868066",
        "name": "sohag",
        "deviceBrand": "Android",
        "deviceId": "unknown",
        "deviceName": "Unknown",
        "deviceModel": "Google Pixel 2 - 8.0 - API 26 - 1080x1920",
        "password": "123456",
        "deviceUniqueId": "35d0a4c0fd61da82",
        "source": 1,
        "deviceIsEmulator": true,
        "deviceIsTablet": false
      })
      .set({
          'apitoken': variables.apiToken,
          'Accept': 'application/json'
      });
      expect(response.status).toEqual(400);
    });

    test("Registration success and not verified", async () => {
      const response = await request(server)
      .post('/customers')
      .send({
        "mobile": "+8801736389284",
        "name": "sohag",
        "deviceBrand": "Android",
        "deviceId": "unknown",
        "deviceName": "Unknown",
        "deviceModel": "Google Pixel 2 - 8.0 - API 26 - 1080x1920",
        "password": "123456",
        "deviceUniqueId": "35d0a4c0fd61da82",
        "source": 1,
        "deviceIsEmulator": true,
        "deviceIsTablet": false
      })
      .set({
          'apitoken': variables.apiToken,
          'Accept': 'application/json'
      });
      expect(response.status).toEqual(response.status);
      expect(response.body.data.mobileVerified).toEqual(false);
    });

    afterAll(() => {
      if (server) {
        server.close();
      }
    });
  });
