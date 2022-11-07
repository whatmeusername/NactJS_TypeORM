import { EntitySchema } from "typeorm";
import { isClassInstance } from "../../../../../core/shared";
import { DataSourceToken, EntityClassOrSchema, TypeOrmRootProviderSettings } from "../interface";
import { DatabaseStorage } from "./storage";
import { isDataSourceToken } from "./validator";

const getDataSourceToken = (DataSource?: DataSourceToken | TypeOrmRootProviderSettings): string => {
	if (DataSource) {
		const dbToken =
			typeof DataSource === "string"
				? DataSource
				: (DataSource as TypeOrmRootProviderSettings).database ?? DataSource.driver.database;
		const token = `DATASOURCE_${dbToken?.toLowerCase()}`;
		if (DatabaseStorage.default.original === token) return token;
	}
	return DatabaseStorage.default.prefix;
};

const getRepositoryToken = (Entity: EntityClassOrSchema, DataSource?: DataSourceToken): string | undefined => {
	let Token = DataSource ? (isDataSourceToken(DataSource) ? DataSource : getDataSourceToken(DataSource)) : null;

	if (!DataSource) {
		Token = DatabaseStorage.getDataSourceTokenByIndex(0);
	}

	let entityName = "";
	if (Entity instanceof EntitySchema) {
		entityName = Entity.options.target ? Entity.options.target.name : Entity.options.name;
	} else if (isClassInstance(Entity)) {
		entityName = Entity.name;
	}

	if (Token) {
		return `ENTITY_${entityName}_${Token}`;
	} else {
		// TODO ---
		throw new Error();
	}
};

export { getDataSourceToken, getRepositoryToken };
