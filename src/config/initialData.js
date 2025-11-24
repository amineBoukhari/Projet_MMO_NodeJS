import Permission from '~/models/permissionModel';
import Role from '~/models/roleModel';

import logger from './logger';

async function initialData() {
    try {
        const countPermissions = await Permission.estimatedDocumentCount();
        if (countPermissions === 0) {
            await Permission.create(
                {
                    controller: 'user',
                    action: 'create'
                },
                {
                    controller: 'user',
                    action: 'read'
                },
                {
                    controller: 'user',
                    action: 'update'
                },
                {
                    controller: 'user',
                    action: 'delete'
                },
                {
                    controller: 'role',
                    action: 'create'
                },
                {
                    controller: 'role',
                    action: 'read'
                },
                {
                    controller: 'role',
                    action: 'update'
                },
                {
                    controller: 'role',
                    action: 'delete'
                },
                {
                    controller: 'school',
                    action: 'create'
                },
                {
                    controller: 'school',
                    action: 'read'
                },
                {
                    controller: 'school',
                    action: 'update'
                },
                {
                    controller: 'school',
                    action: 'delete'
                },
                {
                    controller: 'class',
                    action: 'create'
                },
                {
                    controller: 'class',
                    action: 'read'
                },
                {
                    controller: 'class',
                    action: 'update'
                },
                {
                    controller: 'class',
                    action: 'delete'
                },
                {
                    controller: 'badge',
                    action: 'create'
                },
                {
                    controller: 'badge',
                    action: 'read'
                },
                {
                    controller: 'badge',
                    action: 'update'
                },
                {
                    controller: 'badge',
                    action: 'delete'
                },
                {
                    controller: 'address',
                    action: 'create'
                },
                {
                    controller: 'address',
                    action: 'read'
                },
                {
                    controller: 'address',
                    action: 'update'
                },
                {
                    controller: 'address',
                    action: 'delete'
                },
                {
                    controller: 'tag',
                    action: 'create'
                },
                {
                    controller: 'tag',
                    action: 'read'
                },
                {
                    controller: 'tag',
                    action: 'update'
                },
                {
                    controller: 'tag',
                    action: 'delete'
                },
                {
                    controller: 'student',
                    action: 'create'
                },
                {
                    controller: 'student',
                    action: 'read'
                },
                {
                    controller: 'student',
                    action: 'update'
                },
                {
                    controller: 'student',
                    action: 'delete'
                }

            );
        }
        const countRoles = await Role.estimatedDocumentCount();
        if (countRoles === 0) {
            const permissionsSuperAdministrator = await Permission.find();
            const permissionsAdministrator = await Permission.find({ controller: 'user' });
            const permissionsModerator = await Permission.find({ controller: 'user', action: { $ne: 'delete' } });
            await Role.create(
                {
                    name: 'Super Administrator',
                    permissions: permissionsSuperAdministrator
                },
                {
                    name: 'Administrator',
                    permissions: permissionsAdministrator
                },
                {
                    name: 'Moderator',
                    permissions: permissionsModerator
                },
                {
                    name: 'User',
                    permissions: []
                }
            );
        }
        //we can add default users here
    } catch (err) {
        logger.error(err);
    }
    
}

export default initialData;