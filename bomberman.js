const jatekter = document.getElementById('jatekter');
const meret = 10; 
const cellak = meret * meret;
let jatekos_helyzete = { x: 0, y: 0 };
let ellenfelek = [];
let fejlesztes = 1;
let ajto = 1;
const deathSound = new Audio('cartman.mp3');
const deathAnimation = 'dead.gif';
const kennydead = 'kennydead.gif';
const falblow = 'falrobban.gif';
let felvett_fejlesztesek = [];
let maxBombak = 1;
let aktivBombak = 0;
let bombaHatosugar = 1;
let bombaAktiv = false;
let elet = 3;

function hatosugarNoves() {
    bombaHatosugar += 1; 
}

const cella_tipusok = {
    alap: 'ures',          
    torhetetlen: 'fal',            
    torheto: 'torheto',
    bomba: 'bomba',
    ajto: 'ajto',
    fejlesztes: 'fejlesztes'
}

function veletlen_kezdo_pozicio() {
    let x, y;
    do {
        x = Math.floor(Math.random() * meret);
        y = Math.floor(Math.random() * meret);
    } while ((x === 0 && y === 0) || !ures_cella(x, y));
    return { x, y };
}

function ures_cella(x, y) {
    const cella_index = y * meret + x;
    const cella = document.querySelectorAll('.cella')[cella_index];
    return cella.classList.contains(cella_tipusok.alap);
}

function veletlenhely(szam) {
    ellenfelek = [];
    for (let i = 0; i < szam; i++) {
        ellenfelek.push(veletlen_kezdo_pozicio());
    }
}

function hp() {
    const eletszamlalo = document.getElementById('eletszamlalo');
    eletszamlalo.innerText = "Élet: " + elet;
}

function palya_letrehozasa() {
    ajto = 1;        
    fejlesztes = 1;  
    felvett_fejlesztesek = [];
    jatekter.innerHTML = "";
    for (let y = 0; y < meret; y++) {                
        for (let x = 0; x < meret; x++) {            
            const cella = document.createElement('div');
            cella.classList.add('cella');
            if (y === 0 && x <= 2) {
                cella.classList.add(cella_tipusok.alap); 
            } else if (y % 2 === 1) { 
                if (x % 2 === 0) {
                    cella.classList.add(cella_tipusok.torhetetlen); 
                } else {
                    if (Math.random() < 0.5) {
                        cella.classList.add(cella_tipusok.torheto);
                        if (Math.random() < 0.5 && ajto > 0) {
                            cella.classList.add(cella_tipusok.ajto);
                            ajto--;
                        } else if (Math.random() < 0.5 && fejlesztes > 0) {
                            cella.classList.add(cella_tipusok.fejlesztes);
                            fejlesztes--;
                        }
                    } else {
                        cella.classList.add(cella_tipusok.alap);
                    }                    
                }
            } else {
                const random_szam = Math.random();
                if (random_szam < 0.3) {
                    cella.classList.add(cella_tipusok.torheto); 
                } else {
                    cella.classList.add(cella_tipusok.alap);    
                }
            }
            jatekter.appendChild(cella);
        }
    }
    veletlenhely(3);       
    jatekos_elhelyezes();   
    ellenfel_elhelyezes();  
}


function jatekos_elhelyezes() {
    const cellak = document.querySelectorAll('.cella');
    for (let i = 0; i < cellak.length; i++) {
        cellak[i].classList.remove('jatekos');
    }    
    const jatekos_index = jatekos_helyzete.y * meret + jatekos_helyzete.x;
    cellak[jatekos_index].classList.add('jatekos');
}

function ellenfel_elhelyezes() {
    const cellak = document.querySelectorAll('.cella');
    for (let i = 0; i < cellak.length; i++) {
        cellak[i].classList.remove('ellenfel');
    }
    for (let i = 0; i < ellenfelek.length; i++) {
        const ellenfel = ellenfelek[i];
        const ellenfel_index = ellenfel.y * meret + ellenfel.x;
        cellak[ellenfel_index].classList.add('ellenfel');
    }    
}

function bomba_letrehozasa() {
    if (aktivBombak < maxBombak) {
        aktivBombak++;
        const cellak = document.querySelectorAll('.cella');
        const bomba_index = jatekos_helyzete.y * meret + jatekos_helyzete.x;
        cellak[bomba_index].classList.add('bomba'); 

        setTimeout(() => {
            robbanas(bomba_index); 
            aktivBombak--;
        }, 3000);
    }
}

function robbanas(bomba_index) {
        const cellak = document.querySelectorAll('.cella');
        cellak[bomba_index].classList.remove('bomba');
    
        const robbanasi_iranyok = [
            { x: 0, y: -1 },
            { x: 0, y: 1 }, 
            { x: -1, y: 0 },
            { x: 1, y: 0 },
            { x: 0, y: 0}
        ];
        
        robbanasi_iranyok.forEach(irany => {
            for (let sugar = 1; sugar <= bombaHatosugar; sugar++) {
                const uj_x = (bomba_index % meret) + irany.x * sugar;
                const uj_y = Math.floor(bomba_index / meret) + irany.y * sugar;
    
                if (uj_x < 0 || uj_x >= meret || uj_y < 0 || uj_y >= meret) break;
    
                const uj_index = uj_y * meret + uj_x;
                const cella = cellak[uj_index];
    
                if (cella.classList.contains(cella_tipusok.torheto)) {
                    cella.classList.remove(cella_tipusok.torheto);
                    cella.classList.add(cella_tipusok.alap);
                    cella.classList.add('robbanas');
                    setTimeout(() => {
                        cella.classList.remove('robbanas');
                    }, 300);
                    break;
                } else if (cella.classList.contains(cella_tipusok.torhetetlen)) {
                    break;
                } else {
                    cella.classList.add('robbanas');
                    setTimeout(() => {
                        cella.classList.remove('robbanas');
                    }, 300);
                }
    
                ellenfelek = ellenfelek.filter(ellenfel => {
                    const ellenfel_index = ellenfel.y * meret + ellenfel.x;
                    if (ellenfel_index === uj_index) {
                        cella.classList.remove('ellenfel');
                        const halalkenny = cellak[ellenfel_index];
                        halalkenny.classList.add('halottkenny')
                        halalkenny.style.backgroundImage = `url(${kennydead})`;
                        halalkenny.style.backgroundSize = "cover";
                        setTimeout(() => {
                            halalhely.style.backgroundImage = '';
                            halalkenny.classList.remove('halottkenny');
                        }, 5);
                        return false;
                    }
                    return true;
                });
                if (jatekos_helyzete.x === uj_x && jatekos_helyzete.y === uj_y) {
                    elet--; 
                    hp();
                    if (elet <= 0) {
                        halal();
                        return;
                    }
                }
            }
        });
        bombaAktiv = false; 
}

function ellenfel_sebzes() {
    for (let i = 0; i < ellenfelek.length; i++) {
        if (ellenfelek[i].x === jatekos_helyzete.x && ellenfelek[i].y === jatekos_helyzete.y) {
            elet--;  
            hp();    
            if (elet <= 0) {
                halal();  
            }
            break; 
        }
    }
}

function halal() {
    const cellak = document.querySelectorAll('.cella');
    const jatekos_index = jatekos_helyzete.y * meret + jatekos_helyzete.x;
    const halalhely = cellak[jatekos_index];
    halalhely.classList.add('halott');
    halalhely.style.backgroundImage = `url(${deathAnimation})`;
    halalhely.style.backgroundSize = "cover";
    deathSound.play();
    setTimeout(() => {
        halalhely.style.backgroundImage = '';
        halalhely.classList.remove('halott');
        alert("Játék vége!");
        const jatekter = document.getElementById('jatekter');
        jatekter.innerHTML = "";
        palya_letrehozasa();
        ujjatek();
    }, 1000);
}

function jatekos_mozgatas(irany) {
    let uj_helyzet = { x: jatekos_helyzete.x, y: jatekos_helyzete.y };
    if (irany === 'up' && uj_helyzet.y > 0) uj_helyzet.y--;
    if (irany === 'down' && uj_helyzet.y < meret - 1) uj_helyzet.y++;
    if (irany === 'left' && uj_helyzet.x > 0) uj_helyzet.x--;
    if (irany === 'right' && uj_helyzet.x < meret - 1) uj_helyzet.x++;
    const uj_index = uj_helyzet.y * meret + uj_helyzet.x;
    const cellak = document.querySelectorAll('.cella');
    if (!cellak[uj_index].classList.contains('fal') &&
        !cellak[uj_index].classList.contains('torheto') &&
        !cellak[uj_index].classList.contains('bomba')) {

        if (cellak[uj_index].classList.contains(cella_tipusok.fejlesztes)) {
            const fejlesztesPozicio = `${uj_helyzet.x},${uj_helyzet.y}`;
            if (!felvett_fejlesztesek.includes(fejlesztesPozicio)) {
                felvett_fejlesztesek.push(fejlesztesPozicio);  
                cellak[uj_index].classList.remove(cella_tipusok.fejlesztes);  
            }
        }
        if (cellak[uj_index].classList.contains(cella_tipusok.ajto)) {
            if (ellenfelek.length === 0) {
                ajton();  
            } else {
                alert("Nem léphetsz be az ajtón, amíg vannak ellenfelek!"); 
            }
            return;
        }

        jatekos_helyzete = uj_helyzet;
        jatekos_elhelyezes();
    }

    ellenfel_sebzes();
}

function ajton() {
    jatekter.innerHTML = ""; 
    palya_letrehozasa();      
    ujjatek();                
}

function ellenfelek_mozgatasa() {
    const cellak = document.querySelectorAll('.cella');
    for (let i = 0; i < ellenfelek.length; i++) {
        let uj_helyzet = { x: ellenfelek[i].x, y: ellenfelek[i].y };
        const irany = Math.floor(Math.random() * 4);
        if (irany === 0 && uj_helyzet.y > 0) uj_helyzet.y--;       
        if (irany === 1 && uj_helyzet.y < meret - 1) uj_helyzet.y++; 
        if (irany === 2 && uj_helyzet.x > 0) uj_helyzet.x--;      
        if (irany === 3 && uj_helyzet.x < meret - 1) uj_helyzet.x++; 
        const uj_index = uj_helyzet.y * meret + uj_helyzet.x;
        if (!cellak[uj_index].classList.contains(cella_tipusok.torhetetlen) &&
            !cellak[uj_index].classList.contains(cella_tipusok.torheto) &&
            !cellak[uj_index].classList.contains(cella_tipusok.bomba)) {
            ellenfelek[i] = uj_helyzet;
        }
    } 
    ellenfel_elhelyezes();
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') jatekos_mozgatas('up');
    if (e.key === 'ArrowDown') jatekos_mozgatas('down');
    if (e.key === 'ArrowLeft') jatekos_mozgatas('left');
    if (e.key === 'ArrowRight') jatekos_mozgatas('right');
    if (e.key === ' ') bomba_letrehozasa();
});

function ujjatek(){
    elet = 3;
    hp();
    jatekos_helyzete = { x: 0, y: 0 };
    jatekos_elhelyezes();
}

setInterval(ellenfelek_mozgatasa, 1000);

palya_letrehozasa();