import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // 2. Insert your data using the Prisma client
  await prisma.group.createMany({
    data: [{
      groupName: "Running_OCT",
      description: "10월도 RunRun",
      nickname: "NICE_RUNNING",
      password: "nice_running_oct",
      image: "https://example.com/images/group_logo_A.png",
      tag: [
        "Running"
      ],
      discordwebhookurl: "https://discord.com/api/webhooks/123456789/abcdefgh",
      discordserverinviteurl: "https://discord.gg/test-A",
      goalNumber: 50
    },
    {
      groupName: "Running_ARMY",
      description: "MOYORA ARMY",
      nickname: "RUN_ARMY",
      password: "army_running",
      image: "https://example.com/images/group_logo_A.png",
      tag: [
        "Running",
        "ARMY",
      ],
      discordwebhookurl: "http://discord.gg/running_ARMY",
      discordserverinviteurl: "https://discord.gg/running_ARMY",
      goalNumber: 100
    },
    {
      groupName: "Happy_swimming",
      description: "Swim like a seal",
      nickname: "happy_swimming",
      password: "happy_swimming",
      image: "https://example.com/images/group_logo_A.png",
      tag: [
        "swimming",
      ],
      discordwebhookurl: "http://discord.gg/happy_swimming",
      discordserverinviteurl: "https://discord.gg/happy_swimming",
      goalNumber: 200
    },
    ]
  });

  console.log('Seed data inserted successfully.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // 3. Clean up and close the connection
    await prisma.$disconnect();
  });