import { PrismaClient } from '@prisma/client'
import { AssociationStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create sample associations
  const sampleAssociations = [
    {
      name: 'Idrottsföreningen Kamraterna',
      organizationNumber: '802402-1234',
      description: 'En idrottsförening för fotboll och andra bollsporter',
      address: 'Stadionsvägen 1',
      city: 'Göteborg',
      postalCode: '41650',
      email: 'info@ifk.se',
      phone: '031-123456',
      website: 'https://www.ifk.se',
      category: 'Idrott',
      source: 'goteborg',
      sourceId: 'IFK-001',
    },
    {
      name: 'Studieförningen Vuxenskolan',
      organizationNumber: '802005-5678',
      description: 'Studieförning med fokus på kultur och utbildning',
      address: 'Kulturhuset',
      city: 'Stockholm',
      postalCode: '11152',
      email: 'info@sv.se',
      phone: '08-123456',
      website: 'https://www.sv.se',
      category: 'Utbildning',
      source: 'stockholm',
      sourceId: 'SV-001',
    },
  ]

  for (const association of sampleAssociations) {
    await prisma.association.upsert({
      where: { organizationNumber: association.organizationNumber },
      update: association,
      create: {
        ...association,
        status: AssociationStatus.ACTIVE,
      },
    })
  }

  // Add sample contacts for the first association
  const ifkAssociation = await prisma.association.findUnique({
    where: { organizationNumber: '802402-1234' },
  })

  if (ifkAssociation) {
    await prisma.contact.createMany({
      data: [
        {
          name: 'Anna Andersson',
          role: 'Ordförande',
          email: 'anna.andersson@ifk.se',
          phone: '070-123456',
          isPrimary: true,
          associationId: ifkAssociation.id,
        },
        {
          name: 'Bengt Bengtsson',
          role: 'Kassör',
          email: 'bengt.bengtsson@ifk.se',
          phone: '070-234567',
          isPrimary: false,
          associationId: ifkAssociation.id,
        },
      ],
      skipDuplicates: true,
    })
  }

  console.log('Database seeded successfully!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
