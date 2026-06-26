import type { Payload } from 'payload'

const TEAM_DATA = [
  {
    name: 'Elisabeth Rohm',
    role: 'Co-Founder, Director & Producer',
    bio: "Elisabeth Rohm is an acclaimed actress, director, and producer, best known for her role in Law & Order (Emmy and SAG nominee).\n\nHer collaboration with David O. Russell in the Oscar-nominated American Hustle earned her a SAG Award for Best Ensemble. She also starred in Russell's Joy as well as Jay Roach's Oscar-nominated Bombshell.\n\nBeginning with her directorial debut, Girl In the Basement, inspired by a true story and praised for its unflinching storytelling, Rohm has directed eight feature-length films including Shopping Cart Killer, Wife Stalker, Husband, Father, Killer, Switched Before Birth, Devil on Campus: The Larry Ray Story, and Girl in Room 13, earning her recognition for her compelling approach to female-led and socially conscious narratives.\n\nHer episodic directing credits include Law & Order and Chicago Med.",
    photoPath: '/assets/team/liz-rohm-hero.png',
  },
  {
    name: 'Kara Feifer',
    role: 'Co-Founder & Producer',
    bio: "Feifer began her career in the industry as an actress. She starred in the International series Time Of Your Life which was broadcast throughout the world and in 9 languages.\n\nShe has Executive produced many films at Lifetime including Tempting Fate, To Have and To Hold, and Family Pictures on which she and Rohm ignited their friendship and business relationship.\n\nFeifer is also the Executive Producer of She Wants More, a Webby nominated iHeart Podcast.\n\nFeifer holds both a BFA in acting and a MSW from New York University.\nShe is a licensed clinician in the State of New York.",
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

    const data = {
      name: member.name,
      role: member.role,
      bio: member.bio,
      sortOrder: i,
      ...(photoId ? { photo: photoId } : {}),
    }

    if (existing.docs.length > 0) {
      await payload.update({
        collection: 'team-members',
        id: existing.docs[0]!.id,
        data: data as never,
      })
    } else {
      await payload.create({
        collection: 'team-members',
        data: data as never,
      })
    }
  }

  console.log('[seed-team] Done.')
}
