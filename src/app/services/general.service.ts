import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  api = environment.apiUrl;
  http = inject(HttpClient);

  titlecase(name:string): string {
    return  name.split(" ").map((l: string) => l[0].toUpperCase() + l.substring(1)).join(" ");
  }

  mostrarArchivoBlod(folder:string,file:string){
    let url = `${this.api}/mostrarImagen/${folder}/${file}`;
    return this.http.get(url , { responseType: 'blob' });
  }

  verImagen(folder:string,file:string){
    let url:string = `${this.api}/mostrarImagen/${folder}/${file}`;
    return url;
  }

  subirArchivo(files: Array<File>, name:string, folder : string, url:string){
    let urlCompleta = `${this.api}/${url}`;
    let formdata = new FormData();
    
    if(files){
      for(let i = 0; i < files.length; i++){
        formdata.append(name + '-'+ i,files[i], files[i].name);
     }
    }
    // Agregar el nombre de la carpeta al FormData
    formdata.append('folder', folder);
   return this.http.post<any>(urlCompleta, formdata);
  }

}
