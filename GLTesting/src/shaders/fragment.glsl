precision mediump float;
uniform float uTime;
uniform vec2 resolution;
void main() {

    vec3 c;
	float l;
	vec2 r = resolution;
	float z = uTime;
	for(int i=0;i<3;i++) {
		vec2 uv;
        vec2 p=gl_FragCoord.xy/r;
		uv=p;
		p-=.5;
		p.x*=r.x/r.y;
		z+=.07;
		l=length(p);
		uv+=p/l*(sin(z)+1.)*abs(sin(l*9.-z-z));
		c[i]=.01/length(mod(uv,1.)-.5);
	}
	gl_FragColor=vec4(1.0,0.0,0.0,1.0);
}