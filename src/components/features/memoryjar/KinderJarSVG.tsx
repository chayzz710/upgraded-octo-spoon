interface KinderJarSVGProps {
  noteCount: number
  jarImageSrc: string  // pass your jar image path here e.g. "/assets/memory-jar.webp"
}

export default function KinderJarSVG({ noteCount, jarImageSrc }: KinderJarSVGProps) {
  return (
    <div className="flex flex-col items-center select-none">
      <div style={{ position: 'relative', width: '100%', maxWidth: 280 }}>
        <img
          src={jarImageSrc}
          alt="memory jar"
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />

        {noteCount > 0 && (
          <div style={{
            position: 'absolute',
            top: '34%',
            right: '6%',
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: '#FCE0E8',
            border: '1.5px solid #E69CB5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Caveat, cursive',
            fontSize: 15,
            fontWeight: 700,
            color: '#3B1F0E',
          }}>
            {noteCount}
          </div>
        )}
      </div>

      <p className="font-hand mt-1" style={{ color: 'rgba(106,90,205,0.6)', fontSize: 15 }}>
        {noteCount === 0 ? 'waiting for memories…' : 'click a note to read it ✿'}
      </p>
    </div>
  )
}