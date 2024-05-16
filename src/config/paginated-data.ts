import { PageMetaDto } from "../dtos-globals/page-meta.dto";
import { PageOptionsDto } from "../dtos-globals/page-options.dto";
import { PageDto } from "../dtos-globals/page.dto";

export class PaginatedData {
    public paginateDate(pageOptionsDto: PageOptionsDto, data: any[]){
        const startIndex = pageOptionsDto.skip;
        const endIndex = pageOptionsDto.skip + pageOptionsDto.take;
        
        const subset = data.slice(startIndex, endIndex);
    
        const totalItems = data.length;
    
        const pageMetaDto = new PageMetaDto({
            itemCount: totalItems,
            pageOptionsDto,
        });
    
        const pageDto = new PageDto(subset, pageMetaDto);
    
        return pageDto;
      }
}