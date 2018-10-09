import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../../config/api.config";
import { categoriaDTO } from "../../models/categoria.dto";
import { Observable } from "rxjs/Rx";

@Injectable()
export class CategoriaService {
    constructor(public http: HttpClient){       

    }

    findAll() : Observable<categoriaDTO[]> {
        return this.http.get<categoriaDTO[]>(`${API_CONFIG.baseUrl}/categorias`);
    }
}
