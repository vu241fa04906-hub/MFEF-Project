export default function SkillCard({skill,matched=false}){return <span className={'skill-pill '+(matched?'matched':'')}>{skill}</span>}
