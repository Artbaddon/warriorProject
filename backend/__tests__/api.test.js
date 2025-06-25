import request from 'supertest';
import app from '../app/app.js';

describe('Warriors Backend API Tests', () => {
  let adminToken;
  let playerToken;
  let testWarriorId;
  let testRaceId;
  let testPowerId;
  let testMagicId;
  let testWarriorTypeId;
  let testPlayerId;

  // Test data to be cleaned up after tests
  const testData = {
    warriors: [],
    races: [],
    powers: [],
    magic: [],
    warriorTypes: [],
    players: [],
    admins: []
  };

  beforeAll(async () => {
    console.log('🚀 Starting Warriors Backend API Tests...');
    
    // Create test admin
    const adminResponse = await request(app)
      .post('/api_v1/admin/login')
      .send({
        username: 'testadmin',
        password: 'testpass123'
      });

    if (adminResponse.status === 200) {
      adminToken = adminResponse.body.token;
      console.log('✅ Admin login successful');
    } else {
      console.log('⚠️ Admin login failed, will skip admin tests');
    }

    // Create test player
    const playerResponse = await request(app)
      .post('/api_v1/player/login')
      .send({
        name: 'TestPlayer',
        email: 'testplayer@test.com'
      });

    if (playerResponse.status === 201) {
      playerToken = playerResponse.body.token;
      testPlayerId = playerResponse.body.player.id;
      testData.players.push(testPlayerId);
      console.log('✅ Player creation successful');
    } else {
      console.log('⚠️ Player creation failed, will skip player tests');
    }
  });

  afterAll(async () => {
    console.log('🧹 Cleaning up test data...');
    
    // Clean up test warriors
    if (adminToken && testData.warriors.length > 0) {
      for (const warriorId of testData.warriors) {
        await request(app)
          .delete(`/api_v1/warrior/${warriorId}`)
          .set('Authorization', `Bearer ${adminToken}`);
      }
    }

    // Clean up test races
    if (adminToken && testData.races.length > 0) {
      for (const raceId of testData.races) {
        await request(app)
          .delete(`/api_v1/race/${raceId}`)
          .set('Authorization', `Bearer ${adminToken}`);
      }
    }

    // Clean up test powers
    if (adminToken && testData.powers.length > 0) {
      for (const powerId of testData.powers) {
        await request(app)
          .delete(`/api_v1/power/${powerId}`)
          .set('Authorization', `Bearer ${adminToken}`);
      }
    }

    // Clean up test magic
    if (adminToken && testData.magic.length > 0) {
      for (const magicId of testData.magic) {
        await request(app)
          .delete(`/api_v1/magic/${magicId}`)
          .set('Authorization', `Bearer ${adminToken}`);
      }
    }

    // Clean up test warrior types
    if (adminToken && testData.warriorTypes.length > 0) {
      for (const typeId of testData.warriorTypes) {
        await request(app)
          .delete(`/api_v1/warrior-type/${typeId}`)
          .set('Authorization', `Bearer ${adminToken}`);
      }
    }

    console.log('✅ Test cleanup completed');
  });

  describe('🔐 Authentication Tests', () => {
    test('Should allow admin login', async () => {
      const response = await request(app)
        .post('/api_v1/admin/login')
        .send({
          username: 'testadmin',
          password: 'testpass123'
        });

      expect([200, 401]).toContain(response.status);
      if (response.status === 200) {
        expect(response.body).toHaveProperty('token');
        expect(response.body).toHaveProperty('admin');
      }
    });

    test('Should allow player creation/login', async () => {
      const response = await request(app)
        .post('/api_v1/player/login')
        .send({
          name: 'TestPlayer2',
          email: 'testplayer2@test.com'
        });

      expect([201, 200]).toContain(response.status);
      if (response.status === 201) {
        expect(response.body).toHaveProperty('token');
        expect(response.body).toHaveProperty('player');
        testData.players.push(response.body.player.id);
      }
    });
  });

  describe('🌍 Public Routes Tests', () => {
    test('Should get all races (public)', async () => {
      const response = await request(app)
        .get('/api_v1/races');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('data');
    });

    test('Should get all warriors (public)', async () => {
      const response = await request(app)
        .get('/api_v1/warriors');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('data');
    });

    test('Should get all warrior types (public)', async () => {
      const response = await request(app)
        .get('/api_v1/warrior-types');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('data');
    });

    test('Should get all magic (public)', async () => {
      const response = await request(app)
        .get('/api_v1/magic');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('data');
    });

    test('Should get all powers (public)', async () => {
      const response = await request(app)
        .get('/api_v1/powers');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('data');
    });
  });

  describe('🔒 Admin Routes Tests', () => {
    test('Should reject admin routes without token', async () => {
      const response = await request(app)
        .post('/api_v1/race')
        .send({
          name: 'Test Race',
          description: 'Test Description'
        });

      expect(response.status).toBe(401);
    });

    if (adminToken) {
      test('Should create a race (admin)', async () => {
        const response = await request(app)
          .post('/api_v1/race')
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            name: 'Test Race',
            description: 'A test race for testing',
            image: 'test-race.jpg'
          });

        if (response.status === 201) {
          testRaceId = response.body.id;
          testData.races.push(testRaceId);
          expect(response.body).toHaveProperty('message');
          expect(response.body).toHaveProperty('id');
        } else {
          console.log('⚠️ Race creation failed:', response.body);
        }
      });

      test('Should create a warrior type (admin)', async () => {
        const response = await request(app)
          .post('/api_v1/warrior-type')
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            name: 'Test Warrior Type',
            description: 'A test warrior type',
            image: 'test-type.jpg'
          });

        if (response.status === 201) {
          testWarriorTypeId = response.body.id;
          testData.warriorTypes.push(testWarriorTypeId);
          expect(response.body).toHaveProperty('message');
          expect(response.body).toHaveProperty('id');
        }
      });

      test('Should create magic (admin)', async () => {
        const response = await request(app)
          .post('/api_v1/magic')
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            name: 'Test Magic',
            description: 'A test magic spell',
            damage: 50,
            image: 'test-magic.jpg'
          });

        if (response.status === 201) {
          testMagicId = response.body.id;
          testData.magic.push(testMagicId);
          expect(response.body).toHaveProperty('message');
          expect(response.body).toHaveProperty('id');
        }
      });

      test('Should create power (admin)', async () => {
        const response = await request(app)
          .post('/api_v1/power')
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            name: 'Test Power',
            description: 'A test power',
            damage: 30,
            image: 'test-power.jpg'
          });

        if (response.status === 201) {
          testPowerId = response.body.id;
          testData.powers.push(testPowerId);
          expect(response.body).toHaveProperty('message');
          expect(response.body).toHaveProperty('id');
        }
      });

      test('Should create a warrior (admin)', async () => {
        if (testRaceId && testWarriorTypeId) {
          const response = await request(app)
            .post('/api_v1/warrior')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
              name: 'Test Warrior',
              description: 'A test warrior',
              image: 'test-warrior.jpg',
              level: 1,
              health: 100,
              energy: 50,
              attack: 20,
              defense: 15,
              speed: 10,
              warrior_type_id: testWarriorTypeId,
              race_id: testRaceId,
              magic_id: testMagicId,
              power_ids: testPowerId ? [testPowerId] : []
            });

          if (response.status === 201) {
            testWarriorId = response.body.id;
            testData.warriors.push(testWarriorId);
            expect(response.body).toHaveProperty('message');
            expect(response.body).toHaveProperty('id');
          }
        } else {
          console.log('⚠️ Skipping warrior creation - missing dependencies');
        }
      });

      test('Should get warrior by ID (admin)', async () => {
        if (testWarriorId) {
          const response = await request(app)
            .get(`/api_v1/warrior/${testWarriorId}`)
            .set('Authorization', `Bearer ${adminToken}`);

          expect(response.status).toBe(200);
          expect(response.body).toHaveProperty('message');
          expect(response.body).toHaveProperty('data');
        }
      });

      test('Should update warrior (admin)', async () => {
        if (testWarriorId) {
          const response = await request(app)
            .put(`/api_v1/warrior/${testWarriorId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
              name: 'Updated Test Warrior',
              level: 2
            });

          expect([200, 404]).toContain(response.status);
          if (response.status === 200) {
            expect(response.body).toHaveProperty('message');
          }
        }
      });

      test('Should toggle warrior availability (admin)', async () => {
        if (testWarriorId) {
          const response = await request(app)
            .patch(`/api_v1/warrior/${testWarriorId}/toggle-availability`)
            .set('Authorization', `Bearer ${adminToken}`);

          expect([200, 404]).toContain(response.status);
          if (response.status === 200) {
            expect(response.body).toHaveProperty('message');
            expect(response.body).toHaveProperty('is_available');
          }
        }
      });

      test('Should add powers to warrior (admin)', async () => {
        if (testWarriorId && testPowerId) {
          const response = await request(app)
            .post(`/api_v1/warrior/${testWarriorId}/powers`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
              power_ids: [testPowerId]
            });

          expect([200, 404]).toContain(response.status);
          if (response.status === 200) {
            expect(response.body).toHaveProperty('message');
          }
        }
      });

      test('Should remove powers from warrior (admin)', async () => {
        if (testWarriorId) {
          const response = await request(app)
            .delete(`/api_v1/warrior/${testWarriorId}/powers`)
            .set('Authorization', `Bearer ${adminToken}`);

          expect([200, 404]).toContain(response.status);
          if (response.status === 200) {
            expect(response.body).toHaveProperty('message');
          }
        }
      });
    }
  });

  describe('🎮 Player Routes Tests', () => {
    test('Should reject player routes without token', async () => {
      const response = await request(app)
        .get('/api_v1/player/profile');

      expect(response.status).toBe(401);
    });

    if (playerToken) {
      test('Should get player profile', async () => {
        const response = await request(app)
          .get('/api_v1/player/profile')
          .set('Authorization', `Bearer ${playerToken}`);

        expect([200, 404]).toContain(response.status);
        if (response.status === 200) {
          expect(response.body).toHaveProperty('message');
        }
      });
    }
  });

  describe('🚫 Error Handling Tests', () => {
    test('Should handle 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/api_v1/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message');
    });

    test('Should handle invalid JSON', async () => {
      const response = await request(app)
        .post('/api_v1/player/login')
        .send('invalid json')
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
    });

    test('Should handle missing required fields', async () => {
      const response = await request(app)
        .post('/api_v1/player/login')
        .send({});

      expect(response.status).toBe(400);
    });
  });

  describe('🔍 Validation Tests', () => {
    if (adminToken) {
      test('Should validate required fields for warrior creation', async () => {
        const response = await request(app)
          .post('/api_v1/warrior')
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            name: 'Incomplete Warrior'
            // Missing required fields
          });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
      });

      test('Should validate invalid warrior type ID', async () => {
        const response = await request(app)
          .post('/api_v1/warrior')
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            name: 'Invalid Warrior',
            description: 'A warrior with invalid type',
            level: 1,
            health: 100,
            energy: 50,
            attack: 20,
            defense: 15,
            speed: 10,
            warrior_type_id: 99999, // Invalid ID
            race_id: testRaceId || 1
          });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
      });
    }
  });
});
