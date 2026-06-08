import type { Payload } from 'payload'

const TEAM_DATA = [
  {
    name: 'Elisabeth Rohm',
    role: 'Co-Founder, Director & Producer',
    bio: "Elisabeth Rohm is an acclaimed actress, director, and producer, best known for her role in Law & Order (Emmy and SAG nominee). Her collaboration with David O. Russell in the Oscar-nominated American Hustle earned her a SAG Award for Best Ensemble. She also starred in Russell's Joy as well as Jay Roach's Oscar-nominated Bombshell. Beginning with her directorial debut, Girl In the Basement, inspired by a true story and praised for its unflinching storytelling, Rohm has directed 8 feature-length films including Shopping Cart Killer, Wife Stalker, Husband, Father, Killer, Switched Before Birth, Devil on Campus: The Larry Ray Story, and Girl in Room 13, earning her recognition for her compelling approach to female-led and socially conscious narratives. Episodic directing includes Law & Order and Chicago Med.",
    photoPath: '/assets/team/liz-rohm-hero.png',
  },
  {
    name: 'Kara Feifer',
    role: 'Co-Founder & Executive Producer',
    bio: 'Feifer has previously exec produced several films for Lifetime including Tempting Fate starring Alyssa Milano, To Have and To Hold, and Family Pictures, on which she and Rohm ignited their friendship and business relationship. Feifer is also the executive producer of the podcast She Wants More at iHeart Podcasts, about women and their stories of infidelity. She currently has a number of scripted and unscripted projects in development, including the Christmas movie Finding Atticus, which she will produce alongside Brad Krevoy, with Lorenzo Nardini exec producing. Boris Kodjoe is attached to direct from a script by Jennifer Maisel, and Nicole Ari Parker is attached to star.',
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
