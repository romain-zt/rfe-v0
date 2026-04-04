import type { Payload } from 'payload'

const TEAM_DATA = [
  {
    name: 'Elisabeth Rohm',
    role: 'Co-Founder, Director & Producer',
    bio: 'Elisabeth Rohm is an acclaimed actress, director, and producer, best known for her role in LAW & ORDER (Emmy and SAG nominee). Her collaboration with David O. Russell in the Oscar-nominated AMERICAN HUSTLE earned her a SAG Award for Best Ensemble. Beginning with her directorial debut, GIRL IN THE BASEMENT, Rohm gravitates towards thrilling, woman-centered stories.',
    photoPath: '/assets/team/liz-rohm-hero.png',
  },
  {
    name: 'Kara Feifer',
    role: 'Co-Founder & Executive Producer',
    bio: 'Kara Feifer, entertainment veteran, is known for starring in the international television series TIME OF YOUR LIFE and for her fruitful network collaborations. She executive produced films including TEMPTING FATE, FAMILY PICTURES, HUSBAND/FATHER/KILLER, WIFE STALKER, and DATING APP KILLER: THE MONICA WHITE STORY. She is also executive producer of "She Wants More," the Webby nominated iHeart podcast.',
    photoPath: '/assets/team/kara.png',
  },
]

export async function seedTeam(payload: Payload, mediaMap: Map<string, number>): Promise<void> {
  console.log('[seed-team] Seeding team members...')

  for (let i = 0; i < TEAM_DATA.length; i++) {
    const member = TEAM_DATA[i]!
    const photoId = mediaMap.get(member.photoPath)

    const existing = await payload.find({
      collection: 'team-members',
      where: { name: { equals: member.name } },
      limit: 1,
    })

    const data: Record<string, unknown> = {
      name: member.name,
      role: member.role,
      bio: member.bio,
      sortOrder: i,
    }

    if (photoId) {
      data.photo = photoId
    }

    if (existing.docs.length > 0) {
      await payload.update({
        collection: 'team-members',
        id: existing.docs[0]!.id,
        data,
      })
    } else {
      await payload.create({
        collection: 'team-members',
        data,
      })
    }
  }

  console.log('[seed-team] Done.')
}
